// Wine data - in a real app, this would come from an API
const wineData = [
    {
        id: 1,
        title: "Wine Cellar Experience",
        description: "Explore our historic wine cellar and discover the aging process of fine wines.",
        category: "Experience",
        image: "https://images.unsplash.com/photo-1543699936-c901ddbf0c05",
        tags: ["cellar", "aging", "history", "tour"],
        platforms: ["facebook", "blog"]
    },
    {
        id: 2,
        title: "Wine Tasting Events",
        description: "Join our expert sommeliers for guided tastings of premium wines.",
        category: "Events",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
        tags: ["tasting", "events", "sommelier", "premium"],
        platforms: ["facebook", "linkedin", "youtube"]
    },
    {
        id: 3,
        title: "Vineyard Tours",
        description: "Walk through our scenic vineyards and learn about wine production.",
        category: "Experience",
        image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
        tags: ["vineyard", "tour", "production", "outdoor"],
        platforms: ["youtube", "blog", "podcast"]
    }
];

class SearchUI {
    constructor() {
        this.searchInput = document.querySelector('#searchInput');
        this.searchResults = document.querySelector('#searchResults');
        this.searchWrapper = document.querySelector('#searchWrapper');
        this.filterButtons = document.querySelectorAll('.w-full.flex.justify-center.gap-2.mb-8 button');
        this.activeFilters = new Set();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', this.handleSearch.bind(this));
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.length >= 2) {
                this.searchResults.classList.remove('hidden');
            }
        });

        // Setup filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const platform = this.getPlatformFromButton(button);
                if (button.classList.contains('ring-2')) {
                    button.classList.remove('ring-2', 'ring-offset-2', 'ring-white');
                    this.activeFilters.delete(platform);
                } else {
                    button.classList.add('ring-2', 'ring-offset-2', 'ring-white');
                    this.activeFilters.add(platform);
                }
                this.handleSearch({ target: this.searchInput });
            });
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchWrapper.contains(e.target)) {
                this.searchResults.classList.add('hidden');
            }
        });

        // Prevent clicks within search results from closing the dropdown
        this.searchResults.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    getPlatformFromButton(button) {
        const icon = button.querySelector('i');
        if (icon.classList.contains('fa-facebook-f')) return 'facebook';
        if (icon.classList.contains('fa-linkedin-in')) return 'linkedin';
        if (icon.classList.contains('fa-youtube')) return 'youtube';
        if (icon.classList.contains('fa-blog')) return 'blog';
        if (icon.classList.contains('fa-github')) return 'github';
        if (icon.classList.contains('fa-podcast')) return 'podcast';
        if (icon.classList.contains('fa-ellipsis')) return 'other';
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        if (query.length < 2 && this.activeFilters.size === 0) {
            this.searchResults.innerHTML = '';
            this.searchResults.classList.add('hidden');
            return;
        }

        const results = this.searchWines(query);
        this.displayResults(results);
        this.searchResults.classList.remove('hidden');
    }

    searchWines(query) {
        return wineData.filter(wine => {
            const searchableText = `${wine.title} ${wine.description} ${wine.category} ${wine.tags.join(' ')}`.toLowerCase();
            const matchesSearch = query.length < 2 || searchableText.includes(query);
            const matchesFilters = this.activeFilters.size === 0 || 
                [...this.activeFilters].some(filter => wine.platforms.includes(filter));
            return matchesSearch && matchesFilters;
        }).slice(0, 5);
    }

    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="p-4 text-gray-500 dark:text-gray-400">
                    No results found
                </div>
            `;
            return;
        }

        this.searchResults.innerHTML = results.map(wine => `
            <div class="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer">
                <img src="${wine.image}" alt="${wine.title}" class="w-16 h-16 object-cover rounded-lg">
                <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">${wine.title}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">${wine.description.substring(0, 100)}...</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                        ${wine.platforms.map(platform => `
                            <span class="px-2 py-1 text-xs rounded-full ${this.getPlatformStyle(platform)}">
                                ${platform}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getPlatformStyle(platform) {
        const styles = {
            facebook: 'bg-[#1877F2] text-white',
            linkedin: 'bg-[#0A66C2] text-white',
            youtube: 'bg-[#FF0000] text-white',
            blog: 'bg-[#FF5722] text-white',
            github: 'bg-[#171515] dark:bg-[#2b2b2b] text-white',
            podcast: 'bg-[#8557D0] text-white',
            other: 'bg-[#64748b] dark:bg-[#475569] text-white'
        };
        return styles[platform] || styles.other;
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchUI();
});
